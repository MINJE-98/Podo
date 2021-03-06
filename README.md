# 탈중앙화 참여형 기부 플랫폼(Podo)
# Contents
1. [왜 필요하죠?](#왜-필요하죠?)
2. [Tech Stack](#Tech-Stack)
3. [Service Flow](#Service-Flow)
4. [Demo & QuickView](#Demo-&-QuickView)
# 왜 필요하죠?
단체의 성과를 직접적으로 확인하여 기부 여부를 결정할 수 있는 후원이 있는가 하면, 도움이 필요한 상황만 있고, 후원이 어떻게 사용되는지 기부자가 정확하게 알 수 없는 후원이 있다.

하지만 빈곤 포르노라고 불리는 것이 대부분며, 기부하는 단체에 윤리적인 논란이 발생하고, 내가 기부하는 돈의 대부분은 사업비라는 항목으로 사용이 되는 경우가 많습니다.

이러한 부분들이 현재의 기부의 문제점이라고 생각하였고, 익명성과, 투명성을 함께 가져갈 수 있는 플랫폼이 필요하다고 느껴서 진행해서 구현까지 해본 프로젝트입니다.

# Tech Stack
## BackEnd
- Ethereum
    - Solidity
- Truffle
- Ganache
## FrontEnd
- ReactJS
- web3JS
- MetaMask
# Service Flow
## 단체
### 등록

단체를 생성하고 싶은 유저는 단체를 생성할 수 있습니다.

단체는 주소당 1개까지만 생성가능하며 자신의 주소가 곧 단체의 주소입니다.

## 캠페인

단체들은 여러 캠페인을 생성할 수 있습니다.

### 등록

단체들이 원하는 캠페인을 등록할 수 있습니다.

캠페인은 캠페인의 캠페인 제목, 캠페인 내용, 목표금액으로 작성할 수 있습니다.

### 캠페인 상태

캠페인 진행중: 제안이 제출되어 투표가 진행중입니다.

캠페인 종료: 단체가 제안한 금액만큼 금고에서 단체에게 입금이 됩니다.

## 제안서

캠페인의 모금활동이 끝이나게되면 모금된 금액을 사용하기위해 제안서를 작성해야합니다.

### 등록

제안서는 제안 제목, 제안 내용, 제안 금액을 작성할 수 있습니다.

### 제안서 상태

제안 진행중: 제안이 제출되어 투표가 진행중입니다.

제안 ***통과: 단체가 제안한 금액만큼 금고에서 단체에게 입금이 됩니다.***

제안 부결: 후원자들의 반대 의견이 승리하여, 단체는 제안서를 다시 작성해야합니다.

제안 취소: 단체들이 제안 취소를 할 수 있습니다.

## 후원자

### 후원

단체의 캠페인을 통해 단체에게 후원이 가능합니다.

### 투표권

후원을 하게되면 해당 단체의 투표권을 얻게 됩니다.

### 투표

단체의 투표권으로 단체의 **후원금 사용 제안서**에 투표가 가능합니다.

**후원금 사용 제안서**으로 사용자들은 단체가 작성한 제안서를 확인합니다.

찬성에 투표를 할 수 있습니다.

반대에 투표를 할 수 있습니다.

- 투표를 진행하기 위해 무조건 투표 사유를 작성하여야 합니다.
# Demo & QuickView
## Demo
> 직접 데모에서 서비스를 경험하실 수 있습니다.</br>
> 데모 경험을위해 MetaMask가 설치되어 있어야하며, Repston 테스트 네트워크로 접속해야합니다.

https://minje-98.github.io/Podo/
## QuickView

[![Output](https://user-images.githubusercontent.com/56459078/154900758-d7a4085a-5218-48af-87eb-d2ae9b16e1d4.png)](https://www.youtube.com/watch?v=WQ04huKTywE&feature=youtu.be)

